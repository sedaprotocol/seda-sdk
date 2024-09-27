import ora from "ora";

const spinner = ora({
	// make a singleton so we don't ever have 2 spinners
	spinner: "dots",
});

export const updateSpinnerText = (message: string) => {
	if (spinner.isSpinning) {
		spinner.text = message;
		return;
	}
	spinner.start(message);
};

export const stopSpinner = () => {
	if (spinner.isSpinning) {
		spinner.stop();
	}
};

export const spinnerError = (message?: unknown) => {
	if (spinner.isSpinning) {
		if (typeof message === "string" || message?.toString) {
			spinner.fail(`${message}`);
		} else {
			spinner.fail("Unknown error");
		}
	}
};

export const spinnerSuccess = (message?: string) => {
	if (spinner.isSpinning) {
		spinner.succeed(message);
	}
};

export const spinnerInfo = (message: string) => {
	spinner.info(message);
};
