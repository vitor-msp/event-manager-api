import { User } from "../../src/domain/entities/User";
import { InvalidEmailError } from "../../src/domain/errors/InvalidEmailError";
import { InvalidNameError } from "../../src/domain/errors/InvalidNameError";
import { InvalidPasswordError } from "../../src/domain/errors/InvalidPasswordError";
import { UserInputDto } from "../../src/domain/types/UserInputDto";

describe("Create User Tests", () => {
  const buildUserData = (): UserInputDto => {
    return {
      id: 1,
      email: "  teste@teste.com  ",
      name: "  User Test  ",
      password: "teste123",
    };
  };

  it("should create user", () => {
    const userData = buildUserData();

    const user = new User(userData);

    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Test");
    expect(user.passwordIsCorrect("teste123")).toBe(true);
    expect(user.passwordIsCorrect("Teste123")).toBe(false);
  });

  it("should not create user with invalid email", () => {
    const userData = buildUserData();
    userData.email = "  teste.teste.com  ";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidEmailError);
  });

  it("should not create user with blank name", () => {
    const userData = buildUserData();
    userData.name = "     ";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidNameError);
  });

  it("should not create user with numeric type name", () => {
    const userData = buildUserData();
    userData.name = "  50  ";

    expect(() => {
      new User(userData);
    }).toThrow(InvalidNameError);
  });

  it("should not create user with date type name", () => {
    const userData = buildUserData();
    userData.name = `  ${new Date().toISOString()}  `;

    expect(() => {
      new User(userData);
    }).toThrow(InvalidNameError);
  });
});

describe("Edit User Tests", () => {
  const buildUser = (): User => {
    return new User({
      id: 1,
      email: "  teste@teste.com  ",
      name: "  User Test  ",
      password: "teste123",
    });
  };

  it("should edit user name", () => {
    const user = buildUser();

    user.setName("  User Test Edited  ");

    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Test Edited");
    expect(user.passwordIsCorrect("teste123")).toBe(true);
    expect(user.passwordIsCorrect("Teste123")).toBe(false);
  });

  it("should edit user password", () => {
    const user = buildUser();

    user.changePassword("teste.123", "teste123");

    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Test");
    expect(user.passwordIsCorrect("teste.123")).toBe(true);
    expect(user.passwordIsCorrect("teste123")).toBe(false);
    expect(user.passwordIsCorrect("another_password")).toBe(false);
  });

  it("should not edit user password for invalid current password", () => {
    const user = buildUser();

    expect(() => user.changePassword("teste.123", "testE123")).toThrow(
      InvalidPasswordError
    );
    const { id, email, name } = user.getData();
    expect(id).toBe(1);
    expect(email).toBe("teste@teste.com");
    expect(name).toBe("User Test");
    expect(user.passwordIsCorrect("teste123")).toBe(true);
    expect(user.passwordIsCorrect("teste.123")).toBe(false);
    expect(user.passwordIsCorrect("another_password")).toBe(false);
  });
});
