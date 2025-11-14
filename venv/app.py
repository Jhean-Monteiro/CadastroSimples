# app.py
from flask import Flask, render_template, request, jsonify
import sqlite3
import re

app = Flask(__name__)

# === Criar banco e tabela (se não existir) ===
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            rg TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# === Função para validar CPF (mesma lógica do JS, mas em Python) ===
def validar_cpf(cpf):
    cpf = re.sub(r'\D', '', cpf)
    if len(cpf) != 11 or len(set(cpf)) == 1:
        return False
    # Cálculo dos dígitos verificadores
    def calc_digito(cpf, peso):
        soma = sum(int(cpf[i]) * (peso - i) for i in range(peso-1))
        resto = (soma * 10) % 11
        return 0 if resto > 9 else resto

    if calc_digito(cpf, 10) != int(cpf[9]) or calc_digito(cpf, 11) != int(cpf[10]):
        return False
    return True

# === Rota principal: exibe o formulário ===
@app.route('/')
def index():
    return render_template('index.html')

# === Rota para cadastrar (recebe POST) ===
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.form

    nome = dados['nome'].strip()
    rg = dados['rg']
    cpf = dados['cpf']
    telefone = dados['telefone']
    email = dados['email']
    senha = dados['senha']
    print(cpf)

    erros = []

    # Validações no backend
    if len(nome) < 10:
        erros.append("Nome deve ter pelo menos 10 caracteres.")
    if not re.match(r'^\d{2}\.\d{3}\.\d{3}-\d$', rg):
        erros.append("RG inválido.")
    if not validar_cpf(cpf):
        erros.append("CPF inválido.")
    if not re.match(r'^\(\d{2}\) \d{5}-\d{4}$', telefone):
        erros.append("Telefone inválido.")
    if '@' not in email or '.' not in email:
        erros.append("E-mail inválido.")
    if len(senha) < 6:
        erros.append("Senha deve ter 6 ou mais caracteres.")

    if erros:
        return jsonify({'sucesso': False, 'erros': erros})

    # Tenta inserir no banco
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO usuarios (nome, rg, cpf, telefone, email, senha)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nome, rg, cpf, telefone, email, senha))
        conn.commit()
        conn.close()
        return jsonify({'sucesso': True, 'mensagem': 'Cadastro realizado com sucesso!'})
    except sqlite3.IntegrityError as e:
        if 'cpf' in str(e):
            return jsonify({'sucesso': False, 'erros': ['Cadastro Realizado com sucesso!']})
        if 'email' in str(e):
            return jsonify({'sucesso': False, 'erros': ['Cadastro realizado com sucesso!']})
        return jsonify({'sucesso': False, 'erros': ['Erro ao salvar. Tente novamente.']})

# === Iniciar o banco e rodar o app ===
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host="0.0.0.0")