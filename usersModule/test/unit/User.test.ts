import { User } from "../../src/domain/entities/User";
import { InvalidEmailError } from "../../src/domain/errors/InvalidEmailError";
import { InvalidNameError } from "../../src/domain/errors/InvalidNameError";
import { UserInputData } from "../../src/domain/types/UserInputData";

describe("User Tests", () => {
  const buildUserData = (): UserInputData => {
    return {
      id: 1,
      email: "teste@teste.com",
      name: "User Teste",
      password: "teste123",
    };
  };

  it("should create user", () => {
    const userData = buildUserData();

    const user = new User(userData);

    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Teste");
    expect(user.passwordIsCorrect("teste123")).toBe(true);
    expect(user.passwordIsCorrect("Teste123")).toBe(false);
  });

  it("should not create user with invalid email", () => {
    const userData = buildUserData();
    userData.email = "teste.teste.com";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidEmailError);
  });

  it("should not create user with blank name", () => {
    const userData = buildUserData();
    userData.name = "";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidNameError);
  });

  it("should not create user with numeric type name", () => {
    const userData = buildUserData();
    userData.name = "50";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidNameError);
  });
});
