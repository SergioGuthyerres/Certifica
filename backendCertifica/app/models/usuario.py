from abc import ABC, abstractmethod
from typing import List
import re


class Usuario(ABC):
    def __init__(self, id: str, nome: str, email: str):
        self._id = id
        self._nome = nome
        self.email = email

    @property
    def id(self) -> str:
        return self._id

    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not valor.strip():
            raise ValueError("Nome não pode ser vazio.")
        self._nome = valor.strip()

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, valor: str):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", valor or ""):
            raise ValueError(f"E-mail inválido: '{valor}'.")
        self._email = valor

    @abstractmethod
    def permissoes(self) -> List[str]:
        raise NotImplementedError

    def __repr__(self):
        return f"{self.__class__.__name__}(nome='{self.nome}', email='{self.email}')"


class Organizador(Usuario):
    def __init__(self, id: str, nome: str, email: str, instituicao: str = ""):
        super().__init__(id, nome, email)
        self.instituicao = instituicao

    def permissoes(self) -> List[str]:
        return ["criar_evento", "editar_evento", "emitir_certificado", "ver_relatorios"]


class Palestrante(Usuario):
    def __init__(self, id: str, nome: str, email: str, biografia: str = ""):
        super().__init__(id, nome, email)
        self.biografia = biografia

    def permissoes(self) -> List[str]:
        return ["ver_evento", "registrar_presenca"]


class Participante(Usuario):
    def __init__(self, id: str, nome: str, email: str):
        super().__init__(id, nome, email)

    def permissoes(self) -> List[str]:
        return ["inscrever_se", "ver_certificado_proprio"]