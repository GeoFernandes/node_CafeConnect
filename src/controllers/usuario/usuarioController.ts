

class usuarioController {
  static async entrar(req, res) {
      res.status(200).send("Usuario conectado")
  }
};

export default usuarioController;
