"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateTask } from "@/hooks/useTasks";
import type { Priority } from "@/types/common.types";
import { clsx } from "clsx";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  deadline: z.string().optional(),
  tags: z.string().optional(), // comma-separated — we'll split on submit
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "low",    label: "Low",    color: "border-slate-300  bg-slate-50  text-slate-700  data-[active]:border-slate-500  data-[active]:bg-slate-100" },
  { value: "medium", label: "Medium", color: "border-blue-300   bg-blue-50   text-blue-700   data-[active]:border-blue-500   data-[active]:bg-blue-100" },
  { value: "high",   label: "High",   color: "border-orange-300 bg-orange-50 text-orange-700 data-[active]:border-orange-500 data-[active]:bg-orange-100" },
  { value: "urgent", label: "Urgent", color: "border-red-300    bg-red-50    text-red-700    data-[active]:border-red-500    data-[active]:bg-red-100" },
];

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      tags: "",
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    await createTask.mutateAsync({
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      deadline: data.deadline || undefined,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create new task"
      size="md"
      preventOutsideClose={createTask.isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Title */}
        <Input
          label="Task title"
          placeholder="e.g. Complete project proposal"
          error={errors.title?.message}
          required
          {...register("title")}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Description{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            className={clsx(
              "w-full rounded-xl border border-slate-200 bg-white px-4 py-3",
              "text-sm text-slate-900 placeholder:text-slate-400 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "transition-all duration-150",
              errors.description && "border-red-400 focus:ring-red-400"
            )}
            rows={3}
            placeholder="Add more details about this task..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Priority selector — custom button group using Controller */}
        {/* Controller is needed because this isn't a standard HTML input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-2">
                {priorityOptions.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    data-active={field.value === value ? "" : undefined}
                    onClick={() => field.onChange(value)}
                    className={clsx(
                      "py-2 rounded-xl border text-xs font-medium transition-all",
                      color,
                      field.value === value
                        ? "ring-2 ring-offset-1 ring-current"
                        : "opacity-70 hover:opacity-100"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Deadline */}
        <Input
          label="Deadline"
          type="datetime-local"
          hint="Leave empty for no deadline"
          {...register("deadline")}
        />

        {/* Tags */}
        <Input
          label="Tags"
          placeholder="work, personal, health"
          hint="Comma-separated"
          {...register("tags")}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={createTask.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            loading={createTask.isPending}
          >
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
}