import { motion } from "framer-motion";

function SuccessAnimation({text,header}) {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 overflow-hidden h-full w-screen flex items-center justify-center bg-gray-800 bg-opacity-40 z-50">
      <motion.div
        className="flex justify-center items-center h-[200px] w-[300px] bg-green-50 rounded-2xl z-50 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Wrapper */}
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Spinner */}
          <motion.div
            className="w-16 h-16 border-4 border-t-green-500 border-green-300 rounded-full mb-20"
            initial={{ opacity: 1, rotate: 0 }}
            animate={{ opacity: 0, rotate: 360 }}
            transition={{
              delay: 0,
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
            exit={{ opacity: 0 }}
            style={{ position: "absolute" }}
          />

          {/* Checkmark */}
          <motion.div
            className="w-16 h-16 flex justify-center items-center rounded-full bg-green-500 mb-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.7, duration: 1 }}
            style={{ position: "absolute" }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32px"
              height="32px"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <path d="M20 6L9 17l-5-5" />
            </motion.svg>
          </motion.div>

          {/* Text */}
          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <h2 className="text-2xl font-bold text-green-700">
              {header}
            </h2>
            <p className="text-green-600 mt-2">
              {text}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SuccessAnimation;
