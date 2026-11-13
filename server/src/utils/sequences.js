import Counter from "../models/counter.js";

export const synchronizeSequence = async (name, currentValue) => {
  try {
    await Counter.updateOne(
      { _id: name },
      { $max: { value: currentValue } },
      { upsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    await Counter.updateOne(
      { _id: name },
      { $max: { value: currentValue } },
    );
  }
};

export const nextSequenceValue = async (name) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { value: 1 } },
    { new: true, upsert: true },
  );

  return counter.value;
};
