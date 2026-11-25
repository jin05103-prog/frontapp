
interface AmountProps {
    amount: number
    coupon: number
    handleSubtractAmountClick: () => void
    handleAddAmountClick: () => void
    handleSubtractCouponClick: () => void
    handleAddCouponClick: () => void
}
export default function Amount({
    amount,
    coupon,
    handleSubtractAmountClick,
    handleAddAmountClick,
    handleSubtractCouponClick,
    handleAddCouponClick }: AmountProps) {
        console.log("자식 렌더링")
    return (
        <div className="border border-blue-300 h-15 flex justify-center items-center p-5">
            {amount > 1 && (
                <button className="w-10 h-10 border" onClick={handleSubtractAmountClick}>-</button>
            )}
            <p>수량: {amount}</p>
            <button className="w-10 h-10 border" onClick={handleAddAmountClick}>+</button>

            {coupon > 1 && (
                <button className="w-10 h-10 border" onClick={handleSubtractCouponClick}>-</button>
            )}
            <p>쿠폰: {amount}</p>
            <button className="w-10 h-10 border" onClick={handleAddCouponClick}>+</button>
        </div>
    );
}