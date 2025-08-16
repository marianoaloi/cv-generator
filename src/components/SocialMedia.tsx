
export default () => {
    const data = [
        "https://www.linkedin.com/in/maloi/",
        "https://github.com/maloi",
        "https://www.cloudskillsboost.google/public_profiles/9f110682-e4ec-4bbc-82f4-7b987dd66ace"
    ]
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((link, index) => (
                    <div key={index} className="break-all">
                        <a href={link} className="text-blue-600 hover:text-blue-800 underline">
                            {link}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}