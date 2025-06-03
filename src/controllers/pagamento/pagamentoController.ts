import { JsonController, Post, Body, Req, Res, HttpCode } from "routing-controllers";
import axios from "axios";
import { OpenAPI } from 'routing-controllers-openapi';

interface CriarPagamentoPixBody {
  totalAmount: number;
  payerEmail: string;
  description: string;
}

interface CriarPagamentoCartaoBody {
  totalAmount: number;
  payerEmail: string;
  description: string;
  token: string;
  paymentMethodId: string;
  installments: number;
  issuer: string;
}

@JsonController("/pagamento")

class PagamentoController {
  @Post("/criar-pagamento-pix")
  @OpenAPI({ summary: 'Pagar', description: 'Pagar' })

  @HttpCode(200)
  async criarPagamentoPix(
    @Body() body: CriarPagamentoPixBody,
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      const { totalAmount, payerEmail, description } = body;
      console.log("Dados do pagamento PIX:", body);
      const accessToken = 'TEST-6498827097104807-052115-4edc6595b11307a3b98e549b5e2cc6c0-716666768';;
      const idempotencyKey = req.headers["x-idempotency-key"];

      const payload = {
        transaction_amount: totalAmount,
        description,
        payment_method_id: "pix",
        payer: {
          email: payerEmail
        }
      };

      const response = await axios.post(
        "https://api.mercadopago.com/v1/payments",
        payload,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Idempotency-Key": idempotencyKey || require("crypto").randomUUID()
          }
        }
      );

      const data: any = response.data;

      if (response.status < 200 || response.status >= 300) {
        return res.status(response.status).json(data);
      }

      const transactionData = data.point_of_interaction?.transaction_data;

      return res.status(201).json({
        status: data.status,
        idPagamento: data.id,
        qrCode: transactionData?.qr_code,
        qrCodeBase64: transactionData?.qr_code_base64,
        chavePix: transactionData?.ticket_url
      });
    } catch (error) {
      console.error("Erro ao criar pagamento PIX:", error);
      return res.status(500).json({ msg: "Erro ao criar pagamento PIX", error });
    }
  }

  @Post("/criar-pagamento-cartao")
  @OpenAPI({ summary: 'Pagar com cartão', description: 'Pagar com cartão de crédito' })
  @HttpCode(200)
  async criarPagamentoCartao(
    @Body() body: CriarPagamentoCartaoBody,
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      const { totalAmount, payerEmail, description, token, paymentMethodId, installments, issuer } = body;
      console.log("Dados do pagamento Cartão:", body);
      const accessToken = 'TEST-6498827097104807-052115-4edc6595b11307a3b98e549b5e2cc6c0-716666768';
      const idempotencyKey = req.headers["x-idempotency-key"];

      const payload = {
        type: "online",
        processing_mode: "automatic",
        total_amount: totalAmount.toString(),
        external_reference: "ext_ref_" + Math.random().toString(36).substring(2, 11),
        payer: {
          email: payerEmail
        },
        transactions: {
          payments: [
            {
              amount: totalAmount.toString(),
              payment_method: {
                id: paymentMethodId,
                type: "credit_card",
                token: token,
                installments: installments,
                issuer: issuer
              }
            }
          ]
        }
      };

      const response = await axios.post(
        "https://api.mercadopago.com/v1/orders",
        payload,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Idempotency-Key": idempotencyKey || require("crypto").randomUUID()
          }
        }
      );

      const data: any = response.data;

      if (response.status < 200 || response.status >= 300) {
        return res.status(response.status).json(data);
      }

      return res.status(201).json({
        status: data.status,
        idPagamento: data.id,
        idTransacao: data.transactions.payments[0]?.id,
        detalhes: data.transactions.payments[0]?.status_detail
      });
    } catch (error) {
      console.error("Erro ao criar pagamento com cartão:", error);
      return res.status(500).json({ msg: "Erro ao criar pagamento com cartão", error });
    }
  }
}

export default PagamentoController;