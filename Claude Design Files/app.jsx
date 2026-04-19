// LAYLA — Mount the design system canvas
const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;
const { Cover, Color, Typography, SpaceRadius, Effects,
        Buttons, Inputs, Cards, Badges, Nav, Templates, Rules } = window;

function App() {
  return (
    <DesignCanvas>
      <DCSection title="00 · Cover" subtitle="Design system for LAYLA. Mirror what's already in the artifacts — never invent.">
        <DCArtboard label="Cover"><Cover/></DCArtboard>
        <DCPostIt top={-10} left={930} rotate={3}>
          Hey — start every screen with the mono eyebrow + Bebas display title. It's the LAYLA "signature".
        </DCPostIt>
      </DCSection>

      <DCSection title="Foundations" subtitle="Color, type, space, radius, effects — the atoms.">
        <DCArtboard label="01 · Color palette"><Color/></DCArtboard>
        <DCArtboard label="02 · Typography"><Typography/></DCArtboard>
        <DCArtboard label="03 · Space &amp; radius"><SpaceRadius/></DCArtboard>
      </DCSection>

      <DCSection title="Signature effects" subtitle="What makes a screen feel like LAYLA.">
        <DCArtboard label="04 · Grain · glow · scrim"><Effects/></DCArtboard>
      </DCSection>

      <DCSection title="Components" subtitle="Every reusable primitive in every state, extracted from the 6 artifacts.">
        <DCArtboard label="05 · Buttons"><Buttons/></DCArtboard>
        <DCArtboard label="06 · Inputs &amp; chips"><Inputs/></DCArtboard>
        <DCArtboard label="07 · Cards"><Cards/></DCArtboard>
        <DCArtboard label="08 · Badges &amp; identity"><Badges/></DCArtboard>
        <DCArtboard label="09 · Navigation"><Nav/></DCArtboard>
      </DCSection>

      <DCSection title="Templates" subtitle="How a new LAYLA screen should be structured.">
        <DCArtboard label="10 · Four screen templates"><Templates/></DCArtboard>
      </DCSection>

      <DCSection title="Rules of engagement" subtitle="Consistency > novelty. Ten rules to stay on-system.">
        <DCArtboard label="11 · Rules"><Rules/></DCArtboard>
        <DCPostIt top={40} left={940} rotate={-4}>
          When in doubt: gold CTA, mono eyebrow, night surface, rounded-lg card. That's 80% of the system.
        </DCPostIt>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
