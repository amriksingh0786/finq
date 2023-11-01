import BillingForm from "@/components/BillingForm"
import { getUserSubscriptionPlan } from "@/lib/stripe"

const Page = async () => {
    const subscriptionPlan = await getUserSubscriptionPlan()
    console.log("inside billing page",subscriptionPlan)
    return <BillingForm subscriptionPlan={subscriptionPlan} /> 
}

export default Page