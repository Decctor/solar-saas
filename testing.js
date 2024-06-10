const comissao = {
  aplicavel: true,
  resultados: [
    {
      condicao: {
        aplicavel: true,
        tipo: 'INCLUI_LISTA',
        variavel: 'responsaveis',
        inclui: ['SDR'],
      },
      valor: 0.03,
    },
    {
      condicao: {
        aplicavel: false,
        tipo: null,
        variavel: null,
        inclui: null,
      },
      valor: 0.06,
    },
  ],
}
