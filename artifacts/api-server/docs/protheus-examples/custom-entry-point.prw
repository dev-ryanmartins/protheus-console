/*
    Exemplo didático de ponto de entrada ADVPL.
    Objetivo: validar o pedido antes da confirmação da gravação.
*/

#Include "Protheus.ch"

User Function MT410TOK()
    Local lPermiteGravar := .T.
    Local cMensagem      := ""

    // A rotina recebe o contexto do pedido em memória no ambiente real.
    If Empty(AllTrim(SC5->C5_CLIENTE))
        lPermiteGravar := .F.
        cMensagem := "Cliente do pedido não informado."
    ElseIf SC5->C5_VALOR < 0
        lPermiteGravar := .F.
        cMensagem := "Valor do pedido não pode ser negativo."
    EndIf

    If !lPermiteGravar
        MsgStop(cMensagem, "Validação de integração")
    EndIf

Return lPermiteGravar