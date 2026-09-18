use std::fs;
use std::io;
use std::path::{Path, PathBuf};

const PRETTIER_CONFIG: &str = include_str!("stages/prettier.json");

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Stage {
    pub name: &'static str,
    pub game: &'static str,
    pub answer: &'static str,
}

pub const STAGES: &[Stage] = &[
    Stage {
        name: "fizzbuzz",
        game: include_str!("stages/fizzbuzz/game.js"),
        answer: include_str!("stages/fizzbuzz/ok.js"),
    },
    Stage {
        name: "frontback",
        game: include_str!("stages/frontback/game.js"),
        answer: include_str!("stages/frontback/ok.js"),
    },
    Stage {
        name: "surrounds",
        game: include_str!("stages/surrounds/game.js"),
        answer: include_str!("stages/surrounds/ok.js"),
    },
    Stage {
        name: "swim",
        game: include_str!("stages/swim/game.js"),
        answer: include_str!("stages/swim/ok.js"),
    },
    Stage {
        name: "typing",
        game: include_str!("stages/typing/game.js"),
        answer: include_str!("stages/typing/ok.js"),
    },
];

pub fn find_stage(name: &str) -> Option<&'static Stage> {
    STAGES.iter().find(|stage| stage.name == name)
}

pub fn prepare_world(stage: &Stage, root: &Path) -> io::Result<PathBuf> {
    let world = root.join("world");
    fs::create_dir_all(&world)?;
    fs::write(world.join("game.js"), stage.game)?;
    fs::write(world.join("ok.js"), stage.answer)?;
    fs::write(world.join(".prettierrc"), PRETTIER_CONFIG)?;
    Ok(world.join("game.js"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn finds_known_stage() {
        assert_eq!(
            find_stage("fizzbuzz").map(|stage| stage.name),
            Some("fizzbuzz")
        );
        assert!(find_stage("missing").is_none());
    }

    #[test]
    fn prepares_a_playable_world_without_removing_other_files() {
        let root = temporary_directory("stage");
        let world = root.join("world");
        fs::create_dir_all(&world).unwrap();
        fs::write(world.join("notes.txt"), "keep me").unwrap();

        let game_path = prepare_world(&STAGES[0], &root).unwrap();

        assert_eq!(fs::read_to_string(game_path).unwrap(), STAGES[0].game);
        assert_eq!(
            fs::read_to_string(world.join("notes.txt")).unwrap(),
            "keep me"
        );
        fs::remove_dir_all(root).unwrap();
    }

    fn temporary_directory(label: &str) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("codecrad-{label}-{}-{nonce}", std::process::id()))
    }
}
