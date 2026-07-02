import ast
import os

def python_para_plantuml(codigo_python):
    """ Converte código Python em código PlantUML. """
    arvore = ast.parse(codigo_python)
    classes = []
    herancas = []

    for no in arvore.body:
        if isinstance(no, ast.ClassDef):
            nome_classe = no.name
            atributos = set()
            metodos = []

            for base in no.bases:
                if isinstance(base, ast.Name):
                    herancas.append((base.id, nome_classe))

            for item in no.body:
                if isinstance(item, ast.FunctionDef):
                    metodos.append(item.name)
                    for sub_no in ast.walk(item):
                        if (
                            isinstance(sub_no, ast.Attribute)
                            and isinstance(sub_no.value, ast.Name)
                            and sub_no.value.id == "self"
                        ):
                            atributos.add(sub_no.attr)

            classes.append({
                "nome": nome_classe,
                "atributos": sorted(atributos),
                "metodos": metodos
            })

    linhas = []
    linhas.append("@startuml")
    linhas.append("")
    # Alterado para o título do seu projeto real do IFMA!
    linhas.append("title Diagrama de Classes - Projeto Certifica (IFMA)")
    linhas.append("")

    for classe in classes:
        linhas.append(f"class {classe['nome']} {{")
        for atributo in classe["atributos"]:
            linhas.append(f"    - {atributo}")
        if classe["atributos"] and classe["metodos"]:
            linhas.append("")
        for metodo in classe["metodos"]:
            linhas.append(f"    + {metodo}()")
        linhas.append("}")
        linhas.append("")

    for classe_pai, classe_filha in herancas:
        linhas.append(f"{classe_pai} <|-- {classe_filha}")

    linhas.append("")
    # Adicionando uma legenda automática bem legal para o trabalho
    linhas.append("legend left")
    linhas.append("  Gerado automaticamente via Script AST")
    linhas.append("endlegend")
    linhas.append("")
    linhas.append("@enduml")

    return "\n".join(linhas)

# =====================================================================
# ALTERAÇÃO: Ler o arquivo real do seu projeto em vez de string estática
# =====================================================================
try:
    # Aponta para o caminho relativo correto do seu domain.py
    caminho_domain = os.path.join("..", "backendCertifica", "app", "models", "domain.py")
    
    with open(caminho_domain, "r", encoding="utf-8") as f:
        codigo_projeto_certifica = f.read()
        
    codigo_uml = python_para_plantuml(codigo_projeto_certifica)
    
    # Salva o arquivo de saída na própria pasta de diagramas
    with open("diagrama_classes.puml", "w", encoding="utf-8") as arquivo:
        arquivo.write(codigo_uml)
        
    print("=== Código PlantUML do Certifica gerado com sucesso! ===")
    print("Arquivo 'diagrama_classes.puml' atualizado.")

except FileNotFoundError:
    print(f"Erro: Não foi possível encontrar o arquivo domain.py em: {caminho_domain}")
    print("Certifique-se de executar o script de dentro da pasta 'diagramas-UML'.")