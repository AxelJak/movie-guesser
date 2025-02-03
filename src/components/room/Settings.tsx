import { useEffect, useState } from "react";
import { useZero, useQuery } from "@rocicorp/zero/react";
import { Schema } from "../../schema";
import { createSettings } from "../../utils/settings";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { useForm } from "react-hook-form";

interface SettingsProps {
  roomId: string;
  isHost: boolean;
}

interface SettingsFormValues {
  rounds: number;
  time: number;
  players: number;
}

export default function Settings({ roomId, isHost }: SettingsProps) {
  const z = useZero<Schema>();
  const settings = z.query.settings;
  const players = z.query.player;

  const [roomSettings] = useQuery(settings.where("roomID", roomId).one());
  const [roomPlayers] = useQuery(players.where("roomID", roomId));
  const [settingsID, setSettingsID] = useState("");

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      rounds: roomSettings?.rounds ?? 10,
      time: roomSettings?.time ?? 60,
      players: roomSettings?.players ?? 6,
    },
  });

  useEffect(() => {
    if (!roomSettings && isHost) {
      // Create default settings when room is created
      z.mutate.settings.upsert(createSettings(roomId));
    }
  }, [roomSettings, roomId, isHost, z.mutate.settings]);

  const onSubmit = (values: SettingsFormValues) => {
    if (!roomSettings || !isHost) return;
    z.mutate.settings.update({
      id: roomSettings.id,
      ...values,
    });
  };

  if (!roomSettings) return null;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Room Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rounds</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={!isHost}
                    />
                  </FormControl>
                  <FormDescription>How many rounds to play</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time per Round (seconds)</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[90]}
                      min={30}
                      max={180}
                      step={30}
                      onValueChange={(value : number[]) => field.value = value[0]}
                      disabled={!isHost}
                    />
                  </FormControl>
                  <FormDescription>Time to guess each movie: {field.value}s</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Players</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={!isHost}
                    />
                  </FormControl>
                  <FormDescription>Current players: {roomPlayers.length}</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
