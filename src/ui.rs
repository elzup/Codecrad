use crate::app::{App, DiffKind, GameStatus};
use ratatui::Frame;
use ratatui::layout::{Alignment, Constraint, Layout, Rect};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, Borders, Gauge, List, ListItem, Padding, Paragraph, Wrap};
use std::time::Duration;

const ACCENT: Color = Color::Cyan;
const SUCCESS: Color = Color::Green;
const MUTED: Color = Color::DarkGray;

pub fn render(frame: &mut Frame<'_>, app: &App) {
    let [header, progress, body, footer] = Layout::vertical([
        Constraint::Length(3),
        Constraint::Length(3),
        Constraint::Min(8),
        Constraint::Length(3),
    ])
    .areas(frame.area());

    render_header(frame, app, header);
    render_progress(frame, app, progress);
    if app.status == GameStatus::Finished {
        render_finish(frame, app, body);
    } else {
        render_diff(frame, app, body);
    }
    render_footer(frame, app, footer);
}

fn render_header(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let status = match app.status {
        GameStatus::Playing => {
            Span::styled(" PLAYING ", Style::default().fg(Color::Black).bg(ACCENT))
        }
        GameStatus::Finished => {
            Span::styled(" COMPLETE ", Style::default().fg(Color::Black).bg(SUCCESS))
        }
    };
    let title = Line::from(vec![
        Span::styled(
            " CODECRAD ",
            Style::default().fg(ACCENT).add_modifier(Modifier::BOLD),
        ),
        Span::raw("  "),
        Span::styled(app.stage.name, Style::default().fg(Color::White)),
        Span::raw("  "),
        status,
    ]);
    frame.render_widget(Paragraph::new(title).block(panel()), area);
}

fn render_progress(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let percent = (app.progress() * 100.0).round() as u16;
    let label = format!(" {percent:>3}%  {} ", format_elapsed(app.elapsed()));
    let gauge = Gauge::default()
        .block(Block::default().borders(Borders::LEFT | Borders::RIGHT))
        .gauge_style(Style::default().fg(if percent == 100 { SUCCESS } else { ACCENT }))
        .ratio(app.progress())
        .label(label);
    frame.render_widget(gauge, area);
}

fn render_diff(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let items = app.diff_lines().into_iter().map(|line| {
        let (prefix, color) = match line.kind {
            DiffKind::Same => ("  ", MUTED),
            DiffKind::Added => ("+ ", SUCCESS),
            DiffKind::Removed => ("- ", Color::Red),
        };
        ListItem::new(Line::from(vec![
            Span::styled(
                prefix,
                Style::default().fg(color).add_modifier(Modifier::BOLD),
            ),
            Span::styled(line.text, Style::default().fg(color)),
        ]))
    });
    let block = panel()
        .title(" remaining diff ")
        .title_style(Style::default().fg(ACCENT));
    frame.render_widget(List::new(items).block(block), area);
}

fn render_finish(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let message = vec![
        Line::from(""),
        Line::from(Span::styled(
            "✓ STAGE CLEAR",
            Style::default().fg(SUCCESS).add_modifier(Modifier::BOLD),
        )),
        Line::from(""),
        Line::from(format!(
            "{}  •  {}",
            app.stage.name,
            format_elapsed(app.elapsed())
        )),
        Line::from(""),
        Line::from(Span::styled("Nice work. Ready for another run.", MUTED)),
    ];
    let paragraph = Paragraph::new(message)
        .alignment(Alignment::Center)
        .wrap(Wrap { trim: true })
        .block(panel().title(" result ").padding(Padding::top(1)));
    frame.render_widget(paragraph, area);
}

fn render_footer(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let hint = match app.status {
        GameStatus::Playing => "Edit world/game.js in your editor  •  q / esc quit",
        GameStatus::Finished => "enter close  •  q / esc close",
    };
    frame.render_widget(
        Paragraph::new(hint)
            .centered()
            .style(Style::default().fg(MUTED))
            .block(panel()),
        area,
    );
}

fn panel<'a>() -> Block<'a> {
    Block::default()
        .borders(Borders::ALL)
        .border_style(Style::default().fg(MUTED))
}

pub fn format_elapsed(duration: Duration) -> String {
    let total_millis = duration.as_millis();
    let minutes = total_millis / 60_000;
    let seconds = total_millis % 60_000 / 1_000;
    let millis = total_millis % 1_000;
    format!("{minutes:02}:{seconds:02}.{millis:03}")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::app::App;
    use crate::stage::{STAGES, prepare_world};
    use ratatui::Terminal;
    use ratatui::backend::TestBackend;
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn renders_stage_progress_and_controls() {
        let root = temporary_directory();
        let game_path = prepare_world(&STAGES[0], &root).unwrap();
        let app = App::new(&STAGES[0], game_path).unwrap();
        let backend = TestBackend::new(80, 24);
        let mut terminal = Terminal::new(backend).unwrap();

        terminal.draw(|frame| render(frame, &app)).unwrap();
        let screen = terminal.backend().to_string();

        assert!(screen.contains("CODECRAD"));
        assert!(screen.contains("fizzbuzz"));
        assert!(screen.contains("remaining diff"));
        assert!(screen.contains("Edit world/game.js"));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn formats_elapsed_time_for_speedruns() {
        assert_eq!(format_elapsed(Duration::from_millis(62_345)), "01:02.345");
    }

    fn temporary_directory() -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("codecrad-ui-{}-{nonce}", std::process::id()))
    }
}
