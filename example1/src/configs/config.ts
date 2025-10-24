type Config = {
  lang : string;
  apiOfferUrl: string,
  apiUrl: string,
  apiWs : string,
  keycloak : string,
  keycloak_client : string,
};

let CONFIG: Config =
{
  lang : 'pl',
  apiOfferUrl:  '#',
  apiUrl: 'https://api.e-talar.com',
  apiWs:  '#',
  keycloak : '#',
  keycloak_client : 'client',
};

export default CONFIG
