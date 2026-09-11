import { AdvancedTerminal } from '../../components/market/AdvancedTerminal';

export default function MarketPage() {
  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      {/* We use negative margins to make the terminal go full width of the main container */}
      <AdvancedTerminal />
    </div>
  );
}
