import { useParams } from 'react-router-dom';
import DeliveryForm from '../components/DeliveryForm';

function DeliveryFormPage() {
  const { token } = useParams();

  return <DeliveryForm token={token} />;
}

export default DeliveryFormPage;
