<?php

namespace App\Controller;

use App\Entity\Event;
use App\Form\EventType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EventController extends AbstractController
{
    #[Route('/event/{id}', name: 'app_event', methods: ['GET'])]
    public function index(Event $event)
    {
        header("Content-Type: application/json");
        if (!$event) {
            echo json_encode('Error');
            exit();
        }
        $data = $event->toFullCalendarJsArray(false);
        echo json_encode($data);
        exit;
    }

    #[Route('/event/save', name: 'app_event_new', methods: ['POST'])]
    #[Route('/event/update/{id}', name: 'app_event_update', methods: ['POST'])]
    public function saveEvent(Request $request, EntityManagerInterface $entityManager, Event $event = null)
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        /** @var User $user */
        $user = $this->getUser();

        if ($event == null)
            $event = new Event;
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $event->setAgenda($user->getAgenda());

            $entityManager->persist($event);
            $entityManager->flush();

            // return $this->json(json_encode($event->toFullCalendarJsArray()));
            header("Content-Type: application/json");
            echo json_encode($event->toFullCalendarJsArray());
            exit();
        }

        return $this->json(json_encode(["Invalid data" => $form->getErrors()]), 400);
    }

    #[Route('/event/delete/{id}', name: 'app_event_delete', methods: ['POST'])]
    public function deleteEvent(Event $event, EntityManagerInterface $entityManager)
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if ($event) {
            $entityManager->remove($event);
            $entityManager->flush();
            echo json_encode('Successfully delete event');
            exit();
        }
    }
}
