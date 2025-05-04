import { JsonController, Post, Body, HttpCode, Authorized, CurrentUser } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController("/pagamento")
export default class PagamentoController {

    @Post("/pix")
    @HttpCode(200)
    @Authorized()
    @OpenAPI({ summary: 'Pagamento via PIX', description: 'Simula um pagamento via PIX gerando uma chave e QR Code fake' })
    async pagamentoPix(@CurrentUser() user: any) {
        try {
            // Simulação de pagamento via Pix
            return {
                success: true,
                metodo: "PIX",
                message: "Pagamento via PIX iniciado.",
                pixKey: "cafeconnect@pagamento.com",
                qrCodeUrl: "https://fakepix.qr/api/qrcode.png",
                transactionId: `PIX-${Date.now()}`
            };
        } catch (e) {
            return { success: false, message: 'Erro ao processar pagamento via PIX.', error: (e as any).message };
        }
    }

    @Post("/cartao")
    @HttpCode(200)
    @Authorized()
    @OpenAPI({ summary: 'Pagamento via Cartão de Crédito', description: 'Simula uma transação com cartão de crédito (sem validação real)' })
    async pagamentoCartao(
        @CurrentUser() user: any,
        @Body() dados: {
            cardNumber: string,
            cardHolder: string,
            expiration: string,
            cvv: string,
            amount: number
        }
    ) {
        try {
            // Validação básica mockada
            if (!dados.cardNumber || !dados.cvv || !dados.amount) {
                return { success: false, message: "Dados de pagamento incompletos." };
            }

            // Simula sucesso no pagamento
            return {
                success: true,
                metodo: "Cartão de Crédito",
                message: "Pagamento aprovado.",
                transactionId: `CC-${Date.now()}`
            };
        } catch (e) {
            return { success: false, message: 'Erro ao processar pagamento com cartão.', error: (e as any).message };
        }
    }
}
