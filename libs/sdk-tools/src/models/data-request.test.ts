import { getDataRequestId } from "../../../../dist/libs/sdk-tools/src/models/data-request.js";

describe("data-request", () => {
  it("should create the correct data request id", () => {
    const id = getDataRequestId({
      drBinaryId:
        "0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2",
      drInputs: new Uint8Array(),
      tallyInputs: new Uint8Array(),
    });

    expect(id).toBe(
      "5b84773b008ddca1d7ac9c50f0c3511a7130a960b81181448772e404b299ac2a"
    );
  });
});
