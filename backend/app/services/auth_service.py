from flask_jwt_extended import create_access_token
from app.factories.usuario_factory import UsuarioFactory
from app.repositories.usuario_repository import UsuarioRepository
from app.exceptions import UsuarioNaoEncontradoException, AgendamentoInvalidoException


class AuthService:
    def __init__(self):
        self._repo = UsuarioRepository()

    def registrar(self, dados: dict):
        if self._repo.get_by_email(dados["email"]):
            raise AgendamentoInvalidoException("E-mail já cadastrado")
        factory = UsuarioFactory.get_factory(dados["tipo_usuario"])
        usuario = factory.criar(dados)
        self._repo.save(usuario)
        self._repo.commit()
        return usuario

    def login(self, email: str, senha: str) -> str:
        usuario = self._repo.get_by_email(email)
        if not usuario or not usuario.verificar_senha(senha):
            raise UsuarioNaoEncontradoException("Credenciais inválidas")
        token = create_access_token(
            identity=str(usuario.id),
            additional_claims={
                "tipo_usuario": usuario.tipo_usuario,
                "nome": usuario.nome,
            },
        )
        return token
