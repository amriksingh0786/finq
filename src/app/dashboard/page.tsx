import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
const Page = () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if(!user || !user.id) redirect('/authcallback/?origin=/dashboard');
    return (
        <div>
        <h1>{user.email}</h1>
        </div>
    );
}

export default Page;