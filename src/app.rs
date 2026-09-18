use crate::stage::Stage;
use similar::{ChangeTag, TextDiff};
use std::fs;
use std::io;
use std::path::PathBuf;
use std::time::{Duration, Instant};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum GameStatus {
    Playing,
    Finished,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum DiffKind {
    Same,
    Added,
    Removed,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DiffLine {
    pub kind: DiffKind,
    pub text: String,
}

pub struct App {
    pub stage: &'static Stage,
    pub file_path: PathBuf,
    pub status: GameStatus,
    current: String,
    started_at: Instant,
    elapsed: Duration,
    initial_distance: usize,
}

impl App {
    pub fn new(stage: &'static Stage, file_path: PathBuf) -> io::Result<Self> {
        let current = fs::read_to_string(&file_path)?;
        let initial_distance = edit_distance(&current, stage.answer).max(1);
        Ok(Self {
            stage,
            file_path,
            status: GameStatus::Playing,
            current,
            started_at: Instant::now(),
            elapsed: Duration::ZERO,
            initial_distance,
        })
    }

    pub fn refresh(&mut self) -> io::Result<()> {
        if self.status == GameStatus::Finished {
            return Ok(());
        }
        self.elapsed = self.started_at.elapsed();
        let next = fs::read_to_string(&self.file_path)?;
        if next != self.current {
            self.current = next;
        }
        if self.current == self.stage.answer {
            self.status = GameStatus::Finished;
        }
        Ok(())
    }

    pub fn elapsed(&self) -> Duration {
        self.elapsed
    }

    pub fn progress(&self) -> f64 {
        if self.status == GameStatus::Finished {
            return 1.0;
        }
        let remaining = edit_distance(&self.current, self.stage.answer);
        (1.0 - remaining as f64 / self.initial_distance as f64).clamp(0.0, 1.0)
    }

    pub fn diff_lines(&self) -> Vec<DiffLine> {
        TextDiff::from_lines(&self.current, self.stage.answer)
            .iter_all_changes()
            .map(|change| DiffLine {
                kind: match change.tag() {
                    ChangeTag::Equal => DiffKind::Same,
                    ChangeTag::Insert => DiffKind::Added,
                    ChangeTag::Delete => DiffKind::Removed,
                },
                text: change.value().trim_end_matches('\n').to_owned(),
            })
            .collect()
    }
}

fn edit_distance(current: &str, answer: &str) -> usize {
    TextDiff::from_lines(current, answer)
        .iter_all_changes()
        .filter(|change| change.tag() != ChangeTag::Equal)
        .count()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::stage::{STAGES, prepare_world};
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn reaches_full_progress_when_file_matches_answer() {
        let root = temporary_directory();
        let game_path = prepare_world(&STAGES[0], &root).unwrap();
        let mut app = App::new(&STAGES[0], game_path.clone()).unwrap();

        fs::write(game_path, STAGES[0].answer).unwrap();
        app.refresh().unwrap();

        assert_eq!(app.status, GameStatus::Finished);
        assert_eq!(app.progress(), 1.0);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn exposes_added_and_removed_diff_lines() {
        let lines = TextDiff::from_lines("old\n", "new\n")
            .iter_all_changes()
            .map(|change| change.tag())
            .collect::<Vec<_>>();

        assert_eq!(lines, vec![ChangeTag::Delete, ChangeTag::Insert]);
    }

    fn temporary_directory() -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("codecrad-app-{}-{nonce}", std::process::id()))
    }
}
