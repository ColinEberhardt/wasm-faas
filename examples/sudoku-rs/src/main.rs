use sudoku::Sudoku;

fn main() {
    let puzzle_line = std::env::var("puzzle").unwrap();
    let sudoku = Sudoku::from_str_line(&puzzle_line).unwrap();
    if let Some(solution) = sudoku.solve_unique() {
        let str = solution.to_str_line().to_string();
        for i in 0..9 {
            println!("{}", str[(i*9)..(i*9+9)].to_string());
        }
    } else {
        println!("failed to solve");
    }
}
