'use client'

import { HelpCircle } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import type { NodeData } from '../types'

interface QuestionNodeProps {
  data: NodeData
  isConnectable: boolean
}

export function QuestionNode({ data, isConnectable }: QuestionNodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-gray-500 dark:!bg-gray-400"
      />

      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.label}</div>
      </div>

      {data.description && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {data.description}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-gray-500 dark:!bg-gray-400"
      />
    </div>
  )
}
