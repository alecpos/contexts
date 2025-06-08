'use server';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {}

export default async function Page({}: Props) {
    return (
        <div className='flex flex-col items-center justify-center w-full p-4'>
            <BioType className='h4'>
                Facebook data deletion instructions:
            </BioType>

            <BioType className='h6'>How to remove your data</BioType>

            <BioType className='body1 mb-2'>
                Bioverse uses a facebook login app to authenticate our users.
                Bivoerse does not save your personal data in our server.
            </BioType>

            <BioType className='body1 mb-4'>
                According to Facebook policy, we have to provide User Data
                Deletion Callback URL or Data Deletion Instructions URL.
            </BioType>
            <BioType className='body1'>
                If you want to delete your activities for Bioverse facebook
                login app, you can remove your information by following these
                steps:
            </BioType>
            <BioType className='body1'>
                [bio-bullet-item] Go to your Facebook Accounts “Settings &
                Privacy”. [/bio-bullet-item] [bio-bullet-item] Click “Settings”
                [/bio-bullet-item] [bio-bullet-item] Then click “Security and
                Login”. [/bio-bullet-item] [bio-bullet-item] Look for “Apps and
                Websites” and you will see all of the apps and websites you have
                linked with your Facebook account. [/bio-bullet-item]
                [bio-bullet-item] Search and Click Bioverse in the search bar.
                [/bio-bullet-item] [bio-bullet-item] Scroll and click “Remove”.
                [/bio-bullet-item]
            </BioType>
        </div>
    );
}
