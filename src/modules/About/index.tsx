export default function AboutModule() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                            Rsbuild with React
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full">
                        </div>
                    </div>

                    <p className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                        Start building amazing things with Rsbuild.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                            <p className="text-gray-600 text-sm">Built on Rspack for blazing fast build speeds</p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="text-4xl mb-3">🎨</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Beautiful UI</h3>
                            <p className="text-gray-600 text-sm">Styled with Tailwind CSS utility classes</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="text-4xl mb-3">🚀</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Modern Stack</h3>
                            <p className="text-gray-600 text-sm">React 19 with TypeScript support</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
