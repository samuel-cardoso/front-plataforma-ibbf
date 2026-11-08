import { maskCpf, maskPhone } from "../mask";

describe("maskPhone", () => {
  it("mantém vazio quando não há dígitos", () => {
    expect(maskPhone("")).toBe("");
    expect(maskPhone("(")).toBe("");
  });

  it("formata progressivamente enquanto o usuário digita", () => {
    expect(maskPhone("51")).toBe("(51");
    expect(maskPhone("519")).toBe("(51) 9");
    expect(maskPhone("5199112233")).toBe("(51) 9911-2233");
    expect(maskPhone("51991112233")).toBe("(51) 99111-2233");
  });

  it("descarta dígitos além do 11º", () => {
    expect(maskPhone("519911122339")).toBe("(51) 99111-2233");
  });
});

describe("maskCpf", () => {
  it("formata o CPF completo e mantém vazio sem dígitos", () => {
    expect(maskCpf("12345678900")).toBe("123.456.789-00");
    expect(maskCpf("")).toBe("");
  });
});
