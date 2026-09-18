use codecrad::app::{App, GameStatus};
use codecrad::stage::{STAGES, find_stage, prepare_world};
use codecrad::ui;
use ratatui::crossterm::event::{self, Event, KeyCode, KeyEventKind};
use std::env;
use std::error::Error;
use std::io;
use std::path::Path;
use std::time::Duration;

const DEFAULT_STAGE: &str = "fizzbuzz";
// 100 ms keeps the timer responsive without continuously polling the edited file.
const FRAME_INTERVAL: Duration = Duration::from_millis(100);

fn main() {
    if let Err(error) = run() {
        eprintln!("codecrad: {error}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), Box<dyn Error>> {
    match parse_command(env::args().skip(1))? {
        Command::Help => print_help(),
        Command::List => print_stages(),
        Command::Version => println!("codecrad {}", env!("CARGO_PKG_VERSION")),
        Command::Play(stage_name) => play(&stage_name)?,
    }
    Ok(())
}

fn play(stage_name: &str) -> Result<(), Box<dyn Error>> {
    let stage = find_stage(stage_name).ok_or_else(|| unknown_stage(stage_name))?;
    let file_path = prepare_world(stage, Path::new("."))?;
    let mut app = App::new(stage, file_path)?;
    let outcome = ratatui::run(|terminal| run_game(terminal, &mut app));
    outcome?;
    if app.status == GameStatus::Finished {
        println!(
            "✓ {} cleared in {}",
            app.stage.name,
            ui::format_elapsed(app.elapsed())
        );
    }
    Ok(())
}

fn run_game(terminal: &mut ratatui::DefaultTerminal, app: &mut App) -> io::Result<()> {
    loop {
        app.refresh()?;
        terminal.draw(|frame| ui::render(frame, app))?;
        if event::poll(FRAME_INTERVAL)? && should_close(event::read()?, app.status) {
            return Ok(());
        }
    }
}

fn should_close(event: Event, status: GameStatus) -> bool {
    let Event::Key(key) = event else {
        return false;
    };
    if key.kind != KeyEventKind::Press {
        return false;
    }
    matches!(key.code, KeyCode::Char('q') | KeyCode::Esc)
        || (status == GameStatus::Finished && key.code == KeyCode::Enter)
}

enum Command {
    Play(String),
    List,
    Help,
    Version,
}

fn parse_command(args: impl Iterator<Item = String>) -> Result<Command, String> {
    let values = args.collect::<Vec<_>>();
    match values.as_slice() {
        [] => Ok(Command::Play(DEFAULT_STAGE.to_owned())),
        [flag] if flag == "--help" || flag == "-h" => Ok(Command::Help),
        [flag] if flag == "--list" || flag == "-l" => Ok(Command::List),
        [flag] if flag == "--version" || flag == "-V" => Ok(Command::Version),
        [stage] if !stage.starts_with('-') => Ok(Command::Play(stage.to_owned())),
        _ => Err("usage: codecrad [stage] | --list | --help".to_owned()),
    }
}

fn unknown_stage(name: &str) -> String {
    let available = STAGES
        .iter()
        .map(|stage| stage.name)
        .collect::<Vec<_>>()
        .join(", ");
    format!("unknown stage '{name}'. Available stages: {available}")
}

fn print_stages() {
    println!("Available stages:");
    for stage in STAGES {
        println!("  {}", stage.name);
    }
}

fn print_help() {
    println!(
        "Codecrad — coding speedrun\n\nUsage:\n  codecrad [stage]\n  codecrad --list\n\nRun without a stage to play {DEFAULT_STAGE}.\nEdit world/game.js until it matches the target shown in the TUI."
    );
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_to_fizzbuzz() {
        let command = parse_command(std::iter::empty()).unwrap();
        assert!(matches!(command, Command::Play(stage) if stage == "fizzbuzz"));
    }

    #[test]
    fn parses_stage_and_flags() {
        assert!(
            matches!(parse_command(["swim".to_owned()].into_iter()), Ok(Command::Play(stage)) if stage == "swim")
        );
        assert!(matches!(
            parse_command(["--list".to_owned()].into_iter()),
            Ok(Command::List)
        ));
    }
}
