package oracle_program

type oracleProgram interface {
	Execution()
	Tally()
}

// Has default implementations
type OracleProgram struct{}

func (op OracleProgram) Execution() {
	// Error "Execution not implemented"
	println("exec")
}

func (op OracleProgram) Tally() {
	// Error "Tally not implemented"
	println("tally")
}

// Main export people should use
func RunOracleProgram(op oracleProgram) {
	op.Execution()
	op.Tally()
}

// All code below is an example
type MyOracleProgram struct {
	OracleProgram
}

func (op MyOracleProgram) Execution() {
	println("EXEC")
}

func (op MyOracleProgram) Tally() {
	println("TALLY")
}

func main() {
	test := MyOracleProgram{}
	RunOracleProgram(test)
}
