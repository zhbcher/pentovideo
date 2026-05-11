/**
 * Dynamically load the producer module. tsup inlines @pentovideo/producer
 * via noExternal so this resolves in the published bundle.
 */
export async function loadProducer() {
  return await import("@pentovideo/producer");
}
