from abc import ABC, abstractmethod
from datetime import datetime

# 1. Tratamento de Exceções (Exceção Personalizada conta como classe)
class ErroRegraNegocio(Exception):
    def __init__(self, mensagem):
        super().__init__(mensagem)


# 2. Classe Base Abstrata (Abstração)
class Usuario(ABC):
    def __init__(self, id, nome, email):
        # Encapsulamento (atributos protegidos)
        self._id = id
        self._nome = nome
        self._email = email

    @property
    def nome(self):
        return self._nome

    # Polimorfismo: método abstrato a ser sobrescrito nas filhas
    @abstractmethod
    def obter_credencial(self):
        pass


# 3. Herança 1
class Participante(Usuario):
    def __init__(self, id, nome, email, matricula):
        super().__init__(id, nome, email)
        self.__matricula = matricula # Encapsulamento estrito (privado)
        self.inscricoes = [] # Coleção de objetos

    @property
    def matricula(self):
        return self.__matricula

    def obter_credencial(self):
        return f"[Credencial Participante] Nome: {self._nome} | Matrícula: {self.__matricula}"


# 4. Herança 2
class Organizador(Usuario):
    def __init__(self, id, nome, email, departamento):
        super().__init__(id, nome, email)
        self.__departamento = departamento

    def obter_credencial(self):
        return f"[Credencial STAFF] {self._nome} - Acesso Livre (Depto: {self.__departamento})"


# 5. Herança 3
class Palestrante(Usuario):
    def __init__(self, id, nome, email, mini_curriculo):
        super().__init__(id, nome, email)
        self.__mini_curriculo = mini_curriculo

    def obter_credencial(self):
        return f"[Credencial VIP Palestrante] {self._nome}"


# 6. Agregação (O local existe independentemente de um evento)
class Local:
    def __init__(self, nome, capacidade, endereco):
        self.nome = nome
        self.capacidade = capacidade
        self.endereco = endereco


# 7. Composição (Uma atividade é parte indissociável de um evento)
class Atividade:
    def __init__(self, titulo, carga_horaria, palestrante):
        self.titulo = titulo
        self.carga_horaria = carga_horaria
        self.palestrante = palestrante # Associação simples


# 8. Classe Estrutural Principal
class Evento:
    def __init__(self, titulo, carga_horaria, local):
        self._titulo = titulo
        self._carga_horaria = carga_horaria
        self._local = local # Agregação: Evento recebe um Local existente
        self._atividades = [] # Coleção de objetos
        self.inscricoes = []
        self._status = "Aberto"

    @property
    def carga_horaria(self):
        return self._carga_horaria
        
    @property
    def titulo(self):
        return self._titulo

    def adicionar_atividade(self, titulo, carga_horaria, palestrante):
        # Composição: O próprio Evento instancia e "dá vida" à Atividade
        nova_atividade = Atividade(titulo, carga_horaria, palestrante)
        self._atividades.append(nova_atividade)


# 9. Associação (Inscrição liga Participante e Evento)
class Inscricao:
    def __init__(self, participante, evento):
        self.participante = participante
        self.evento = evento
        self._frequencia_horas = 0
        self._aprovado = False

    @property
    def aprovado(self):
        return self._aprovado

    def registrar_frequencia(self, horas):
        # Tratamento de exceção com a classe customizada
        if horas < 0:
            raise ErroRegraNegocio("A frequência não pode ser um valor negativo.")
        if self._frequencia_horas + horas > self.evento.carga_horaria:
            raise ErroRegraNegocio("A frequência acumulada excede a carga horária do evento.")
            
        self._frequencia_horas += horas
        self.verificar_aprovacao()

    def verificar_aprovacao(self):
        percentual = self._frequencia_horas / self.evento.carga_horaria
        if percentual >= 0.75:
            self._aprovado = True


# 10. Dependência/Geração de Artefato
class Certificado:
    def __init__(self, inscricao):
        # Regra: Só gera certificado se estiver aprovado
        if not inscricao.aprovado:
            raise ErroRegraNegocio("Certificado não pode ser gerado: Participante não aprovado.")
            
        self.inscricao = inscricao
        self.data_emissao = datetime.now()
        # Gera um código único baseado na matrícula e título do evento
        prefixo_evento = self.inscricao.evento.titulo[:3].upper()
        self.codigo_validacao = f"CERT-{self.inscricao.participante.matricula}-{prefixo_evento}"

    def exibir_resumo(self):
        return f"Certificamos que {self.inscricao.participante.nome} concluiu {self.inscricao.evento.titulo}."