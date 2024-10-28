import { AnimatePresence, motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { FormControl_Shadcn_, FormField_Shadcn_, Input_Shadcn_ } from 'ui'
import { FormItemLayout } from 'ui-patterns/form/FormItemLayout/FormItemLayout'
import { BillingChangeBadge } from '../BillingChangeBadge'
import {
  COMPUTE_BASELINE_THROUGHPUT,
  DiskType,
  RESTRICTED_COMPUTE_FOR_IOPS_ON_GP3,
  THROUGHPUT_RANGE,
} from '../DiskManagement.constants'
import { calculateThroughputPrice } from '../DiskManagement.utils'
import { DiskStorageSchemaType } from '../DiskManagementPanel.schema'
import { DiskManagementThroughputReadReplicas } from '../DiskManagementReadReplicas'
import { InputPostTab } from '../InputPostTab'
import { useEffect } from 'react'

type ThroughputFieldProps = {
  form: UseFormReturn<DiskStorageSchemaType>
  disableInput: boolean
}

export function ThroughputField({ form, disableInput }: ThroughputFieldProps) {
  const { control, formState, setValue, getValues, watch } = form

  const watchedStorageType = watch('storageType')
  const watchedTotalSize = watch('totalSize')
  const watchedComputeSize = watch('computeSize')
  const throughput_mbps = formState.defaultValues?.throughput

  const throughputPrice = calculateThroughputPrice({
    storageType: form.getValues('storageType') as DiskType,
    newThroughput: form.getValues('throughput') || 0,
    oldThroughput: form.formState.defaultValues?.throughput || 0,
  })

  const disableIopsInput =
    RESTRICTED_COMPUTE_FOR_IOPS_ON_GP3.includes(watchedComputeSize) && watchedStorageType === 'gp3'

  // Watch storageType and allocatedStorage to adjust constraints dynamically
  useEffect(() => {
    if (watchedStorageType === 'io2') {
      setValue('throughput', undefined) // Throughput is not configurable for 'io2'
    } else if (watchedStorageType === 'gp3') {
      // Ensure throughput is within the allowed range if it's greater than or equal to 400 GB
      const currentThroughput = form.getValues('throughput')
      const { min, max } = THROUGHPUT_RANGE[DiskType.GP3]
      if (!currentThroughput || currentThroughput < min || currentThroughput > max) {
        setValue('throughput', min) // Reset to default if undefined or out of bounds
      }
    }
  }, [watchedStorageType, watchedTotalSize, setValue, form])

  return (
    <AnimatePresence initial={false}>
      {getValues('storageType') === 'gp3' && (
        <motion.div
          key="throughPutContainer"
          initial={{ opacity: 0, x: -4, height: 0 }}
          animate={{ opacity: 1, x: 0, height: 'auto' }}
          exit={{ opacity: 0, x: -4, height: 0 }}
          transition={{ duration: 0.1 }}
          style={{ overflow: 'hidden' }}
        >
          <FormField_Shadcn_
            name="throughput"
            control={control}
            render={({ field }) => (
              <FormItemLayout
                label="Throughput (MB/s)"
                layout="horizontal"
                description={
                  !formState.errors.throughput && (
                    <DiskManagementThroughputReadReplicas
                      isDirty={formState.dirtyFields.throughput !== undefined}
                      oldThroughput={throughput_mbps ?? 0}
                      newThroughput={field.value ?? 0}
                      oldStorageType={formState.defaultValues?.storageType as DiskType}
                      newStorageType={getValues('storageType') as DiskType}
                    />
                  )
                }
                labelOptional={
                  <>
                    <BillingChangeBadge
                      show={
                        formState.isDirty &&
                        formState.dirtyFields.throughput &&
                        !formState.errors.throughput
                      }
                      beforePrice={Number(throughputPrice.oldPrice)}
                      afterPrice={Number(throughputPrice.newPrice)}
                      className="mb-2"
                    />
                    <p>Amount of data read/written to the disk per second.</p>
                    <p>Higher throughput suits applications with high data transfer needs.</p>
                  </>
                }
              >
                <InputPostTab label="MB/s">
                  <FormControl_Shadcn_>
                    <Input_Shadcn_
                      type="number"
                      {...field}
                      value={
                        disableIopsInput
                          ? COMPUTE_BASELINE_THROUGHPUT[
                              watchedComputeSize as keyof typeof COMPUTE_BASELINE_THROUGHPUT
                            ]
                          : field.value
                      }
                      onChange={(e) => {
                        setValue('throughput', e.target.valueAsNumber, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                      className="flex-grow font-mono rounded-r-none max-w-32"
                      disabled={disableInput || disableIopsInput || watchedStorageType === 'io2'}
                    />
                  </FormControl_Shadcn_>
                </InputPostTab>
              </FormItemLayout>
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
