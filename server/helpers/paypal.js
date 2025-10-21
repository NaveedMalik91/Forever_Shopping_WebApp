const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AfN9S8Enr874sm3CJgPX4QcB_aTHPFKc284u3CngbD-LyFqbxJWK_mQXrVSc_k99XStbUTDyRsajr2-2",
  client_secret: "EEbgRtwX5jfriUi9rlKoRP37CCBOcYzobJHNPcg71TrC7L0tYsZIvDn8TnfBFPHR30updiuiRsORI7BX",
});

module.exports = paypal;
