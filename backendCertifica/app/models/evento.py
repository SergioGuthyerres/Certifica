from datetime import datetime
from .usuario import Organizador


class Evento:
    def __init__(
        self,
        id: str,
        titulo: str,
        descricao: str,
        data: datetime,
        local: str,
        organizador: Organizador,
    ):
        self._id = id
        self.titulo = titulo
        self.descricao = descricao
        self.data = data
        self.local = local
        self.organizador = organizador

    @property
    def id(self) -> str:
        return self._id

    @property
    def titulo(self) -> str:
        return self._titulo

    @titulo.setter
    def titulo(self, valor: str):
        if not valor or not valor.strip():
            raise ValueError("O título do evento não pode ser vazio.")
        self._titulo = valor.strip()

    @property
    def descricao(self) -> str:
        return self._descricao

    @descricao.setter
    def descricao(self, valor: str):
        self._descricao = valor.strip()

    @property
    def data(self) -> datetime:
        return self._data

    @data.setter
    def data(self, valor: datetime):
        if not isinstance(valor, datetime):
            raise ValueError("A data do evento deve ser um objeto datetime.")
        self._data = valor

    @property
    def local(self) -> str:
        return self._local

    @local.setter
    def local(self, valor: str):
        if not valor or not valor.strip():
            raise ValueError("O local do evento não pode ser vazio.")
        self._local = valor.strip()

    @property
    def organizador(self) -> Organizador:
        return self._organizador

    @organizador.setter
    def organizador(self, valor: Organizador):
        if not isinstance(valor, Organizador):
            raise ValueError("O organizador deve ser um objeto Organizador.")
        self._organizador = valor

    def alterar_local(self, novo_local: str):
        self.local = novo_local

    def alterar_data(self, nova_data: datetime):
        self.data = nova_data

    def __repr__(self):
        return (
            f"Evento(titulo='{self.titulo}', "
            f"data='{self.data}', "
            f"local='{self.local}')"
        )