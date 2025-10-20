type Config = {
  lang : string;
  apiOfferUrl: string,
  apiETalarUrl: string,
  apiWs : string,
  keycloak : string,
  keycloak_client : string,
};

let CONFIG: Config =
{
  lang : 'pl',
  apiOfferUrl:  '#',
  apiETalarUrl: 'https://api.e-talar.com',
  apiWs:  '#',
  keycloak : '#',
  keycloak_client : 'client',
};

export default CONFIG
