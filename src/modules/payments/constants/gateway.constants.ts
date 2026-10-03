import { GatewayMetadata } from '../interfaces/payment-gateway.interface';

export const AVAILABLE_GATEWAYS: GatewayMetadata[] = [
  {
    id: 'BANK_TRANSFER',
    name: 'حواله مستقیم بانکی',
    type: 'OFFLINE',
    description: 'واریز به شماره شبا / کارت بانکی فروشگاه با هماهنگی تلفنی و ارائه فیش واریزی',
    currencies: ['IRT', 'IRR'],
    isActive: true,
  },
  {
    id: 'MELLAT',
    name: 'به‌پرداخت ملت (شاپرک)',
    type: 'IRANIAN_SHAPARAK',
    description: 'پرداخت امن و سریع آنلاین با کلیه کارت‌های عضو شبکه شتاب از طریق درگاه به‌پرداخت بانک ملت',
    currencies: ['IRT', 'IRR'],
    isActive: true,
  },
  {
    id: 'ZARINPAL',
    name: 'زرین‌پال (شاپرک)',
    type: 'IRANIAN_SHAPARAK',
    description: 'پرداخت امن آنلاین از طریق درگاه پرداخت اینترنتی زرین‌پال و کلیه کارت‌های بانکی عضو شتاب',
    currencies: ['IRT', 'IRR'],
    isActive: true,
  },
];
