import { User } from "../../src/domain/entities/User";
import { UserInputData } from "../../src/domain/types/UserInputData";

describe("User Tests", () => {
  it("should create user", () => {
    const userData: UserInputData = {
      id: 1,
      email: "teste@teste.com",
      name: "User Teste",
      password: "teste123",
    };

    const user = new User(userData);

    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Teste");
    expect(user.passwordIsCorrect("teste123")).toBe(true);
    expect(user.passwordIsCorrect("Teste123")).toBe(false);
  });
});
