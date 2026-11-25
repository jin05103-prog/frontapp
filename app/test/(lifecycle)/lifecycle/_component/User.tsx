// interface UserProps {
//     name: string
// }

// export default function User({ name }: UserProps) {
//     return (
//         <div>
//             {name}
//         </div >

//     )
// }

import type { User } from "./UserContainer";

interface userProps {
    user: User
}

export default function User({user}: userProps) {
    const {name} = user;

    return (
        <li>{name}</li>
    );
}