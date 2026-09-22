# GrandStay — Front-end

Front-end em React para a atividade de cadastro com busca de endereço via ViaCEP.

## O que está implementado

- Formulário de cadastro de hóspedes.
- Tema visual de hotel.
- Consulta direta à ViaCEP pelo front-end.
- Validação do formato do CEP antes da consulta.
- Tratamento de CEP válido porém inexistente.
- Feedback visual para carregamento/erro/sucesso.
- Preenchimento automático de logradouro, bairro, cidade e UF.
- Listagem de hóspedes.
- Persistência local da lista com `localStorage` apenas para demonstração do front-end.
- Layout responsivo.

## Rodar

```bash
npm install
npm run dev
```

## Observação

O back-end Node/Express e o MySQL não fazem parte deste projeto, conforme solicitado. A listagem usa `localStorage` somente para a demonstração visual do front-end. Quando o back-end estiver pronto, a parte de `guests` pode ser trocada pelas chamadas `fetch` para a API do sistema.

A consulta de CEP usa o fluxo solicitado pela atividade: validar o formato no front-end e consultar a ViaCEP somente depois da validação.
