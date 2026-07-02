class CertificadoBase:
    def gerar_texto(self):
        pass # Método que será sobrescrito (Polimorfismo)

class CertificadoParticipante(CertificadoBase):
    def gerar_texto(self, inscricao):
        return f"Certificamos que {inscricao.participante.nome} participou do evento {inscricao.evento.titulo}."

class CertificadoPalestrante(CertificadoBase):
    def gerar_texto(self, palestrante, evento):
        return f"Certificamos que {palestrante.nome} ministrou palestra no evento {evento.titulo}."

# O Padrão Factory
class CertificadoFactory:
    @staticmethod
    def criar_certificado(tipo):
        if tipo == "participante":
            return CertificadoParticipante()
        elif tipo == "palestrante":
            return CertificadoPalestrante()
        else:
            raise ValueError("Tipo de certificado desconhecido")