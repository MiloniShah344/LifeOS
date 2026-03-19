"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateHabit } from "@/hooks/useHabits";
import { clsx } from "clsx";

const createHabitSchema = z.object({
  title:       z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  icon:        z.string().min(1, "Pick an icon"),
  frequency:   z.enum(["daily", "weekly", "monthly"]),
  targetCount: z.number().min(1).max(10),
});

type CreateHabitFormData = z.infer<typeof createHabitSchema>;

// Popular habit icons for quick pick
const HABIT_ICONS = [
  "💪", "🏃", "📚", "🧘", "🥗", "💧", "😴", "🎯",
  "✍️", "🎸", "🧹", "🌿", "🛁", "☀️", "🧠", "❤️",
  "🚴", "🏊", "🎨", "🍎", "☕", "📝", "🏋️", "🌙",
];

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHabitModal({ isOpen, onClose }: CreateHabitModalProps) {
  const createHabit = useCreateHabit();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateHabitFormData>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      title:       "",
      description: "",
      icon:        "🎯",
      frequency:   "daily",
      targetCount: 1,
    },
  });

  const selectedIcon = watch("icon");

  const onSubmit: SubmitHandler<CreateHabitFormData> = async (data: CreateHabitFormData) => {
    await createHabit.mutateAsync(data);
    reset();
    onClose();
  };

  const frequencyOptions = [
    { value: "daily",   label: "Daily",   desc: "Every day" },
    { value: "weekly",  label: "Weekly",  desc: "Once a week" },
    { value: "monthly", label: "Monthly", desc: "Once a month" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title="Create new habit"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Icon picker */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Choose an icon
          </label>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-8 gap-1.5">
                {HABIT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => field.onChange(icon)}
                    className={clsx(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all",
                      field.value === icon
                        ? "bg-indigo-100 ring-2 ring-indigo-400 scale-110"
                        : "bg-slate-50 hover:bg-slate-100 hover:scale-105"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.icon && (
            <p className="text-xs text-red-500 mt-1">{errors.icon.message}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Habit name"
          placeholder={`e.g. ${selectedIcon} Morning run`}
          error={errors.title?.message}
          required
          {...register("title")}
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Why is this habit important to you?"
          {...register("description")}
        />

        {/* Frequency */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Frequency
          </label>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {frequencyOptions.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={clsx(
                      "p-3 rounded-xl border text-left transition-all",
                      field.value === value
                        ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => { reset(); onClose(); }}
            disabled={createHabit.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={createHabit.isPending}>
            Build this habit
          </Button>
        </div>
      </form>
    </Modal>
  );
}