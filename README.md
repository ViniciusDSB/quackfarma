Clone este repositório para sua pasta de trabalho;<br>
Abra o terminal na pasta e rode: <br>
    docker compose up --build<br>
nas proximas apenas um<br>
    docker compose up<br>

E no linux, dependendo da sua configuração, coloque o sudo antes dos comandos :smile:
    
O docker irá dar pull nas imagens e iniciar 3 containers:<br>
mega-projeto_server, mega-projeto-front e postgres.<br>
Espere todos os 3 estarem prontos, observe no no terminal se as seguintes mensagens aparecem:<br>
    db-1       | 2024-07-14 18:19:29.883 UTC [1] LOG:  database system is ready to accept connection<br>
    server-1      | Server running at http://0.0.0.0:3000<br>
    front-1   |   - Local:   http://localhost:8080/

Após isso: <br>
Vá ao navegador e acesse http://localhost:8081. <br>
Há 5 rotas para teste:<br>
http://localhost:3001/ exibe um formulário para interagir com as próximas rotas (e cria a tabela de testes)<br>
http://localhost:3001/insert<br>
http://localhost:3001/select<br> 
http://localhost:3001/update<br>
http://localhost:3001/delete
