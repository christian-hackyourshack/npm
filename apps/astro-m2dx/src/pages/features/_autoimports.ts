import { Card } from '@components/Card';
import FancyCard from '@components/FancyCard/FancyCard.astro';

const foo = {
  BaseCard: Card,
  Card: FancyCard,
};

// We are using silly names just for demonstration purposes
export default foo;
