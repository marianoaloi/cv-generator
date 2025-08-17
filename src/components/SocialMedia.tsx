
import Image from 'next/image';

const SocialMedia = () => {
    const data = [
        {"name":"linkedin/maloi","icon":"./linkedin-circle-svgrepo-com.svg","url":"https://www.linkedin.com/in/maloi"},
        {"name":"github/marianoaloi","icon":"./Octicons-mark-github.svg","url":"https://github.com/marianoaloi"},
        {"name":"cloudskillsboost","icon":"./gcp-svgrepo-com.svg","url":"https://www.cloudskillsboost.google/public_profiles/9f110682-e4ec-4bbc-82f4-7b987dd66ace"}
    ]
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((sm, index) => (
                    <div key={index} className="break-all">
                        <Image src={sm.icon} alt={sm.name} width={24} height={24} className="inline-block mr-2" />
                        <a href={sm.url} className="text-blue-600 hover:text-blue-800 underline">
                            {sm.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SocialMedia;