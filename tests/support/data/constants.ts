import type { AddressData } from '../../pages/AddressCreatePage';
import type { CardData } from '../../pages/PaymentPage';

export const PASSWORD = 'Test@1234';

export const DEFAULT_ADDRESS: AddressData = {
  country: 'Brazil',
  name: 'Test User',
  mobile: '1234567890',
  zip: '01310100',
  address: 'Test Street, 1',
  city: 'São Paulo',
  state: 'SP',
};

export const DEFAULT_CARD: CardData = {
  name: 'João Silva',
  number: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2090',
};
