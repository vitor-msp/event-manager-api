import { EncryptData } from "../../src/domain/helpers/EncryptData";

describe("EncryptData Tests", () => {
  it("should encrypt data", () => {
    const data = "teste123";

    const encryptedData = EncryptData.execute(data);

    expect(encryptedData).not.toBe("teste123");
  });
});
