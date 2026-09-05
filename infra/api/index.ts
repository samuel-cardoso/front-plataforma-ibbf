// Não reexporta "./config" aqui: parte daquela pasta é server-only (cookies, backend-client)
// e não pode ser incluída em um barrel importado por componentes client. Importe
// infra/api/config/bff-api.config diretamente quando precisar do cliente Axios.
export * from "./services";
export * from "./mappers";
export * from "./helpers";
export * from "./endpoints";
