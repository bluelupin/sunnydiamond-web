type CartGlobalGiftNoteProps = {
  note: string;
};

/** Shared gift note banner for single-wrap gifting — shown once above cart items. */
const CartGlobalGiftNote = ({ note }: CartGlobalGiftNoteProps) => (
  <div className="bg-white px-4 py-5 lg:px-6">
    <p className="font-gill text-sm font-normal leading-110 text-darkblack lg:text-base">
      Gift note for all items
    </p>
    <p className="mt-2 font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
      {note}
    </p>
  </div>
);

export default CartGlobalGiftNote;
